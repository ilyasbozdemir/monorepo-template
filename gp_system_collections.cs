using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace API
{
    // Enumler
    public enum DatabaseProvider { MongoDB, Postgres, Firebase, Memory }
    public enum DatabaseEnvironment { PRODUCTION, STAGING, TEST, DEVELOPMENT }
    public enum ActionType { Read, Create, Update, Delete }

    // Modeller
    public class GlobalPolicyRule
    {
        public ActionType Action { get; set; }
        public string Condition { get; set; } 
        public bool Allow { get; set; }
    }

    public class IndexDefinition
    {
        public Dictionary<string, int> Keys { get; set; } = new Dictionary<string, int>();
        public bool? Unique { get; set; }
        public bool? Sparse { get; set; }
        public int? ExpireAfterSeconds { get; set; }
    }

    public class CollectionRule
    {
        public string ListRule { get; set; }
        public string ViewRule { get; set; }
        public string CreateRule { get; set; }
        public string UpdateRule { get; set; }
        public string DeleteRule { get; set; }
    }

    public class SubCollection
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Parent { get; set; }
    }

    public class Collection
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool? System { get; set; }
        public long? CreatedAt { get; set; }
        public List<SubCollection> SubCollections { get; set; } = new List<SubCollection>();
        public CollectionRule Rules { get; set; }
        public List<IndexDefinition> Indexes { get; set; } = new List<IndexDefinition>();
    }

    // Servis (in-memory)
    public class CollectionService
    {
        private readonly List<Collection> _collections = new List<Collection>();

        public IEnumerable<Collection> GetAll() => _collections;

        public Collection GetByName(string name) =>
            _collections.FirstOrDefault(c => c.Name == name);

        public Collection Create(Collection collection)
        {
            if (_collections.Any(c => c.Name == collection.Name))
                throw new InvalidOperationException($"Collection '{collection.Name}' already exists.");

            collection.CreatedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            _collections.Add(collection);
            return collection;
        }

        public Collection Update(string name, Collection updated)
        {
            var collection = GetByName(name);
            if (collection == null)
                throw new KeyNotFoundException($"Collection '{name}' not found.");

            collection.Description = updated.Description;
            collection.System = updated.System;
            collection.SubCollections = updated.SubCollections;
            collection.Rules = updated.Rules;
            collection.Indexes = updated.Indexes;

            return collection;
        }

        public void Delete(string name)
        {
            var collection = GetByName(name);
            if (collection == null)
                throw new KeyNotFoundException($"Collection '{name}' not found.");

            _collections.Remove(collection);
        }
    }

    // Controller
    [ApiController]
    [Route("api/[controller]")]
    public class CollectionsController : ControllerBase
    {
        private readonly CollectionService _service = new CollectionService();

        [HttpGet]
        public ActionResult<IEnumerable<Collection>> GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpGet("{name}")]
        public ActionResult<Collection> Get(string name)
        {
            var collection = _service.GetByName(name);
            if (collection == null) return NotFound();
            return Ok(collection);
        }

        [HttpPost]
        public ActionResult<Collection> Create([FromBody] Collection collection)
        {
            try
            {
                var created = _service.Create(collection);
                return CreatedAtAction(nameof(Get), new { name = created.Name }, created);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPut("{name}")]
        public ActionResult<Collection> Update(string name, [FromBody] Collection updated)
        {
            try
            {
                var result = _service.Update(name, updated);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{name}")]
        public ActionResult Delete(string name)
        {
            try
            {
                _service.Delete(name);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
