<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  import Router from "svelte-spa-router";
  import Main from "./routes/Main.svelte";
  import Login from "./routes/Login.svelte";

  const routes = {
    "/": Main,
    "/login": Login,
  };

  onMount(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      push("/login");
    } else if (token) {
      push("/");
    }
  });
</script>

<Router {routes} />
