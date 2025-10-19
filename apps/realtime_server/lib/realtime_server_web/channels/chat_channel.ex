defmodule RealtimeServerWeb.ChatChannel do
  use Phoenix.Channel
  alias RealtimeServerWeb.Presence

  # Kullanıcı odaya katıldığında
  def join("chat:lobby", %{"user" => user}, socket) do
    IO.puts("[Chat] #{user} joined chat:lobby ✅")

    # Kullanıcı bilgisini socket'e ata
    socket = assign(socket, :user, user)

    # after_join mesajını kendine gönder (Presence takibi için)
    send(self(), :after_join)

    {:ok, %{message: "Welcome to room!"}, socket}
  end

  # Kullanıcı odaya katıldıktan hemen sonra Presence’e ekle
  def handle_info(:after_join, socket) do
    user = socket.assigns.user

    # Kullanıcıyı presence listesine ekle
    Presence.track(socket, user, %{
      online_at: inspect(System.system_time(:second))
    })

    # Tüm presence listesini client’a gönder
    push(socket, "presence_state", Presence.list(socket))

    {:noreply, socket}
  end

  # Yeni mesaj geldiğinde
  def handle_in("new_msg", %{"body" => body, "user" => user}, socket) do
    IO.puts("[Chat] #{user}: #{body}")
    broadcast!(socket, "new_msg", %{user: user, body: body})
    {:noreply, socket}
  end
end
