# lib/realtime_server_web/controllers/event_controller.ex
defmodule RealtimeServerWeb.EventController do
  use RealtimeServerWeb, :controller

  def create(conn, params) do
    # Event'i GenServer'a gönder
    GenServer.cast(RealtimeServer.MongoDBChangeStream, {:event, params})
    json(conn, %{status: "ok"})
  end
end
