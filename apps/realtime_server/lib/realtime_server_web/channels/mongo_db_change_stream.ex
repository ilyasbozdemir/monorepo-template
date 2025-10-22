defmodule RealtimeServer.MongoDBChangeStream do
  use GenServer
  alias Phoenix.PubSub

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def init(state) do
    IO.puts("[MongoDBChangeStream] Listening to MongoDB changes...")
    {:ok, state}
  end

  def handle_cast({:event, params}, state) do
    IO.inspect(params, label: "[MongoDBChangeStream] Received event")
    PubSub.broadcast(RealtimeServer.PubSub, "mongo:events", params)
    {:noreply, state}
  end
end
