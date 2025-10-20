defmodule RealtimeServerWeb.MongoChannel do
  use Phoenix.Channel

  # Kanal ismi "mongo:updates" olacak
  def join("mongo:updates", _payload, socket) do
    IO.puts("[MongoChannel] Client joined the channel ✅")
    {:ok, socket}
  end
end
