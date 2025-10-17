defmodule RealtimeServerWeb.ErrorJSONTest do
  use RealtimeServerWeb.ConnCase, async: true

  test "renders 404" do
    assert RealtimeServerWeb.ErrorJSON.render("404.json", %{}) == %{errors: %{detail: "Not Found"}}
  end

  test "renders 500" do
    assert RealtimeServerWeb.ErrorJSON.render("500.json", %{}) ==
             %{errors: %{detail: "Internal Server Error"}}
  end
end
