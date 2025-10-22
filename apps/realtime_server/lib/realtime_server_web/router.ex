defmodule RealtimeServerWeb.Router do
  use RealtimeServerWeb, :router

  pipeline :api do
    plug(:accepts, ["json"])
  end

  # ---- Root Route ----
  scope "/", RealtimeServerWeb do
    pipe_through(:api)

    get("/", DefaultController, :index)
  end

  # ---- API Routes ----
  scope "/api", RealtimeServerWeb do
    pipe_through(:api)

    # örnek:
    # get "/users", UserController, :index
  end

  scope "/api", RealtimeServerWeb do
    pipe_through(:api)
    post("/events", EventController, :create)
  end

  # ---- Dev tools ----
  if Application.compile_env(:realtime_server, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through([:fetch_session, :protect_from_forgery])

      live_dashboard("/dashboard", metrics: RealtimeServerWeb.Telemetry)
      forward("/mailbox", Plug.Swoosh.MailboxPreview)
    end
  end
end
