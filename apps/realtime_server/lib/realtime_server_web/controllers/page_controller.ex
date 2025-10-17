defmodule RealtimeServerWeb.PageController do
  use RealtimeServerWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
