using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.IO.Compression;
using System.Text.Json;

namespace MongoDBServerAPI.Controllers;

[NonController]
[Route("v{version:apiVersion}/backup")]
[ApiVersion("1.0")]
public class BackupManagementController : ControllerBase
{
    private readonly IMongoClient _mongoClient;
    private readonly IConfiguration _config;
    private readonly string _backupPath;

    public BackupManagementController(IMongoClient client, IConfiguration config)
    {
        _mongoClient = client;
        _config = config;
        _backupPath = config.GetValue<string>("BackupSettings:Path") ?? "backups";

        // Backup klasörünü oluştur
        if (!Directory.Exists(_backupPath))
            Directory.CreateDirectory(_backupPath);
    }

    // Mevcut veritabanlarını listele
    [HttpGet("databases")]
    public async Task<IActionResult> ListDatabases()
    {
        try
        {
            var databases = await _mongoClient.ListDatabaseNamesAsync();
            var dbList = await databases.ToListAsync();
            return Ok(dbList);
        }
        catch (Exception ex)
        {
            return BadRequest($"Veritabanları listelenirken hata: {ex.Message}");
        }
    }

    // Belirli bir veritabanındaki collection'ları listele
    [HttpGet("databases/{databaseName}/collections")]
    public async Task<IActionResult> ListCollections(string databaseName)
    {
        try
        {
            var database = _mongoClient.GetDatabase(databaseName);
            var collections = await database.ListCollectionNamesAsync();
            var collectionList = await collections.ToListAsync();
            return Ok(collectionList);
        }
        catch (Exception ex)
        {
            return BadRequest($"Collection'lar listelenirken hata: {ex.Message}");
        }
    }

    // Tam veritabanı yedekleme
    [HttpPost("backup/database/{databaseName}")]
    public async Task<IActionResult> BackupDatabase(string databaseName, [FromQuery] bool compress = true)
    {
        try
        {
            var database = _mongoClient.GetDatabase(databaseName);
            var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            var backupFolder = Path.Combine(_backupPath, $"{databaseName}_{timestamp}");
            Directory.CreateDirectory(backupFolder);

            var collections = await database.ListCollectionNamesAsync();
            var collectionList = await collections.ToListAsync();

            var backupInfo = new
            {
                DatabaseName = databaseName,
                BackupDate = DateTime.Now,
                Collections = new List<object>()
            };

            foreach (var collectionName in collectionList)
            {
                var collection = database.GetCollection<BsonDocument>(collectionName);
                var documents = await collection.Find(new BsonDocument()).ToListAsync();

                var collectionData = new
                {
                    Name = collectionName,
                    DocumentCount = documents.Count,
                    Documents = documents.Select(doc => doc.ToJson()).ToList()
                };

                ((List<object>)backupInfo.Collections).Add(new
                {
                    Name = collectionName,
                    DocumentCount = documents.Count
                });

                var fileName = Path.Combine(backupFolder, $"{collectionName}.json");
                await System.IO.File.WriteAllTextAsync(fileName, JsonSerializer.Serialize(collectionData, new JsonSerializerOptions { WriteIndented = true }));
            }

            // Backup bilgilerini kaydet
            var infoFileName = Path.Combine(backupFolder, "backup_info.json");
            await System.IO.File.WriteAllTextAsync(infoFileName, JsonSerializer.Serialize(backupInfo, new JsonSerializerOptions { WriteIndented = true }));

            // Sıkıştırma
            if (compress)
            {
                var zipFileName = $"{backupFolder}.zip";
                ZipFile.CreateFromDirectory(backupFolder, zipFileName);
                Directory.Delete(backupFolder, true);

                return Ok(new
                {
                    Message = "Veritabanı başarıyla yedeklendi ve sıkıştırıldı",
                    BackupFile = zipFileName,
                    Collections = ((List<object>)backupInfo.Collections).Count
                });
            }

            return Ok(new
            {
                Message = "Veritabanı başarıyla yedeklendi",
                BackupFolder = backupFolder,
                Collections = ((List<object>)backupInfo.Collections).Count
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Yedekleme sırasında hata: {ex.Message}");
        }
    }

    // Seçili collection'ları yedekleme
    [HttpPost("backup/collections")]
    public async Task<IActionResult> BackupSelectedCollections([FromBody] BackupRequest request)
    {
        try
        {
            if (request.Collections == null || !request.Collections.Any())
                return BadRequest("En az bir collection seçilmelidir");

            var database = _mongoClient.GetDatabase(request.DatabaseName);
            var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            var backupFolder = Path.Combine(_backupPath, $"{request.DatabaseName}_selected_{timestamp}");
            Directory.CreateDirectory(backupFolder);

            var backupInfo = new
            {
                DatabaseName = request.DatabaseName,
                BackupDate = DateTime.Now,
                SelectedCollections = request.Collections,
                Collections = new List<object>()
            };

            foreach (var collectionName in request.Collections)
            {
                var collection = database.GetCollection<BsonDocument>(collectionName);
                var documents = await collection.Find(new BsonDocument()).ToListAsync();

                var collectionData = new
                {
                    Name = collectionName,
                    DocumentCount = documents.Count,
                    Documents = documents.Select(doc => doc.ToJson()).ToList()
                };

                ((List<object>)backupInfo.Collections).Add(new
                {
                    Name = collectionName,
                    DocumentCount = documents.Count
                });

                var fileName = Path.Combine(backupFolder, $"{collectionName}.json");
                await System.IO.File.WriteAllTextAsync(fileName, JsonSerializer.Serialize(collectionData, new JsonSerializerOptions { WriteIndented = true }));
            }

            // Backup bilgilerini kaydet
            var infoFileName = Path.Combine(backupFolder, "backup_info.json");
            await System.IO.File.WriteAllTextAsync(infoFileName, JsonSerializer.Serialize(backupInfo, new JsonSerializerOptions { WriteIndented = true }));

            // Sıkıştırma
            if (request.Compress)
            {
                var zipFileName = $"{backupFolder}.zip";
                ZipFile.CreateFromDirectory(backupFolder, zipFileName);
                Directory.Delete(backupFolder, true);

                return Ok(new
                {
                    Message = "Seçili collection'lar başarıyla yedeklendi ve sıkıştırıldı",
                    BackupFile = zipFileName,
                    Collections = request.Collections.Count
                });
            }

            return Ok(new
            {
                Message = "Seçili collection'lar başarıyla yedeklendi",
                BackupFolder = backupFolder,
                Collections = request.Collections.Count
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Yedekleme sırasında hata: {ex.Message}");
        }
    }

    // Yedekleme dosyalarını listele
    [HttpGet("backups")]
    public IActionResult ListBackups()
    {
        try
        {
            var backupFiles = new List<object>();

            // ZIP dosyaları
            var zipFiles = Directory.GetFiles(_backupPath, "*.zip");
            foreach (var zipFile in zipFiles)
            {
                var fileInfo = new FileInfo(zipFile);
                backupFiles.Add(new
                {
                    Name = fileInfo.Name,
                    Type = "Compressed",
                    Size = $"{fileInfo.Length / 1024} KB",
                    CreatedDate = fileInfo.CreationTime,
                    FullPath = zipFile
                });
            }

            // Klasörler
            var directories = Directory.GetDirectories(_backupPath);
            foreach (var directory in directories)
            {
                var dirInfo = new DirectoryInfo(directory);
                var files = dirInfo.GetFiles("*.json");
                backupFiles.Add(new
                {
                    Name = dirInfo.Name,
                    Type = "Folder",
                    Size = $"{files.Sum(f => f.Length) / 1024} KB",
                    CreatedDate = dirInfo.CreationTime,
                    FullPath = directory,
                    FileCount = files.Length
                });
            }

            return Ok(backupFiles.OrderByDescending(b => ((DateTime)((dynamic)b).CreatedDate)));
        }
        catch (Exception ex)
        {
            return BadRequest($"Yedekleme dosyaları listelenirken hata: {ex.Message}");
        }
    }

    // Yedekleme dosyasını indir
    [HttpGet("download/{fileName}")]
    public IActionResult DownloadBackup(string fileName)
    {
        try
        {
            var filePath = Path.Combine(_backupPath, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("Yedekleme dosyası bulunamadı");

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/zip", fileName);
        }
        catch (Exception ex)
        {
            return BadRequest($"Dosya indirilirken hata: {ex.Message}");
        }
    }

    // Yedekleme dosyasını sil
    [HttpDelete("delete/{fileName}")]
    public IActionResult DeleteBackup(string fileName)
    {
        try
        {
            var filePath = Path.Combine(_backupPath, fileName);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
                return Ok($"Yedekleme dosyası '{fileName}' silindi");
            }

            var folderPath = Path.Combine(_backupPath, fileName);
            if (Directory.Exists(folderPath))
            {
                Directory.Delete(folderPath, true);
                return Ok($"Yedekleme klasörü '{fileName}' silindi");
            }

            return NotFound("Yedekleme dosyası veya klasörü bulunamadı");
        }
        catch (Exception ex)
        {
            return BadRequest($"Silme işlemi sırasında hata: {ex.Message}");
        }
    }

    // Zamanlanmış yedekleme ayarları
    [HttpPost("schedule")]
    public IActionResult ScheduleBackup([FromBody] ScheduleBackupRequest request)
    {
        try
        {
            // Bu kısım için Hangfire, Quartz.NET veya benzeri bir job scheduler kullanılabilir
            // Şimdilik basit bir cron expression validation yapıyoruz

            if (string.IsNullOrWhiteSpace(request.CronExpression))
                return BadRequest("Cron expression gereklidir");

            // Cron expression'ı validate et (basit kontrol)
            var cronParts = request.CronExpression.Split(' ');
            if (cronParts.Length != 5 && cronParts.Length != 6)
                return BadRequest("Geçersiz cron expression formatı");

            // Burada normalde job scheduler'a kayıt yapılır
            // Örnek: BackgroundJob.RecurringJob.AddOrUpdate(() => BackupDatabase(request.DatabaseName), request.CronExpression);

            return Ok(new
            {
                Message = "Zamanlanmış yedekleme ayarlandı",
                DatabaseName = request.DatabaseName,
                CronExpression = request.CronExpression,
                NextRun = "Job scheduler entegrasyonu gerekli"
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Zamanlama ayarlanırken hata: {ex.Message}");
        }
    }
}

// Request modelleri
public class BackupRequest
{
    public string DatabaseName { get; set; } = string.Empty;
    public List<string> Collections { get; set; } = new();
    public bool Compress { get; set; } = true;
}

public class ScheduleBackupRequest
{
    public string DatabaseName { get; set; } = string.Empty;
    public List<string>? Collections { get; set; }
    public string CronExpression { get; set; } = string.Empty;
    public bool Compress { get; set; } = true;
    public bool FullDatabase { get; set; } = true;
}
