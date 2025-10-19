defmodule RealtimeServerWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :realtime_server

  @session_options [
    store: :cookie,
    key: "_realtime_server_key",
    signing_salt: "1d9/lKtZ",
    same_site: "Lax"
  ]

  socket("/live", Phoenix.LiveView.Socket,
    websocket: [connect_info: [session: @session_options]],
    longpoll: [connect_info: [session: @session_options]]
  )

  # WebSocket bağlantı noktası (client ile konuşacak)
  socket("/socket", RealtimeServerWeb.UserSocket,
    websocket: true,
    longpoll: false
  )

  plug(Plug.Static,
    at: "/",
    from: :realtime_server,
    gzip: not code_reloading?,
    only: RealtimeServerWeb.static_paths()
  )

  if code_reloading? do
    plug(Phoenix.CodeReloader)
  end

  plug(Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"
  )

  plug(Plug.RequestId)
  plug(Plug.Telemetry, event_prefix: [:phoenix, :endpoint])

  plug(Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()
  )

  plug(Plug.MethodOverride)
  plug(Plug.Head)
  plug(Plug.Session, @session_options)
  plug(RealtimeServerWeb.Router)
end
