defmodule RealtimeServerWeb.Presence do
  use Phoenix.Presence,
    otp_app: :realtime_server,
    pubsub_server: RealtimeServer.PubSub
end
