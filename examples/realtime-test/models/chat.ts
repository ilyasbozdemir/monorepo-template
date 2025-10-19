interface IMessage {
  messageId: string; // Mesajın benzersiz ID'si
  senderId: string; // Mesajı gönderen kullanıcı
  recipientId: string; // Mesajı alan kullanıcı
  messageContent: string; // Mesajın içeriği
  timestamp: number; // Mesajın gönderildiği zaman
  readStatus: boolean; // Mesajın okundu mu
  messageType: "text" | "image" | "file"; // Mesaj türü (yazılı, resim, dosya vb.)
  relatedAdId?: string; // Mesajın bir ilan ile ilişkili olduğu durum
}

interface IChat {
  chatId: string; // Chat'in benzersiz ID'si
  participants: string[]; // Chat'e katılan kullanıcı ID'leri (sender ve recipient dahil)
  messages: IMessage[]; // Chat'e ait mesajlar
  lastUpdated: number; // Chat'in son güncellenme tarihi
  isRead: boolean; // Chat okundu mu
}
