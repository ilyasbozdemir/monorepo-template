defmodule RealtimeServerWeb.DefaultController do
  use RealtimeServerWeb, :controller

  def index(conn, _params) do
    json(conn, %{message: "Realtime server up and running 🚀"})
  end
end
