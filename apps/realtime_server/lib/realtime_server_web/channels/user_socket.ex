defmodule RealtimeServerWeb.UserSocket do
  use Phoenix.Socket

  ## Kanallar
  channel "chat:*", RealtimeServerWeb.ChatChannel
  channel "mongo:updates", RealtimeServerWeb.MongoChannel

  ## Transport
  transport :websocket, Phoenix.Transports.WebSocket

  @impl true
  def connect(_params, socket, _connect_info) do
    IO.puts("[UserSocket] Client connected ✅")
    {:ok, socket}
  end

  @impl true
  def id(_socket), do: nil
end
