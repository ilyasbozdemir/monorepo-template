export interface ISupportRequest {
    requestId: string; // Talebin benzersiz ID'si
    userId: string; // Talebi gönderen kullanıcının ID'si
    department: "technical" | "advertising" | "payment" | "other"; // Departman (örneğin: teknik, reklam, ödeme)
    title: string; // Talebin başlığı
    status: "pending" | "inProgress" | "resolved" | "closed"; // Talebin durumu
    createdAt: number; // Talebin oluşturulma tarihi (timestamp)
    updatedAt: number; // Talebin son güncellenme tarihi
    priority: "low" | "medium" | "high"; // Talebin önceliği
    assignedTo?: string; // Destek talebini üstlenen yetkili kişinin ID'si (isteğe bağlı)
    attachments?: string[]; // Talebe ait ek dosyalar (isteğe bağlı, dosya URL'leri)
  
    // Mesajlar kısmı, her mesajda gönderen kişi, tarih ve içerik olacak
    messages: ISupportRequestMessage[]; // Talep ile ilişkili mesajlar
  }
  
  export interface ISupportRequestMessage {
    messageId: string; // Mesajın benzersiz ID'si
    senderId: string; // Mesajı gönderen kullanıcının ID'si
    content: string; // Mesaj içeriği
    timestamp: number; // Mesajın gönderilme tarihi (timestamp)
    messageType: "text" | "file"; // Mesaj tipi (metin veya dosya)
    relatedAdId?: string; // Eğer mesaj bir ilanla ilgiliyse, ilan ID'si
  
    readStatus: boolean; // Mesajın okundu mu
  }
  