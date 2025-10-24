<script lang="ts">
  import { push } from "svelte-spa-router";
  import type { AuthResponse } from "../utils/types";

  let login: string = "",
    password: string = "",
    error: string = "";

  async function handleSubmit() {
    error = "";
    const credentials = btoa(`${login}:${password}`);

    try {
      const authRes = await fetch("/api/authentication", {
        method: "GET",
        headers: { Authorization: `Basic ${credentials}` },
      });

      if (!authRes.ok) {
        const errorData = await authRes.json();
        error = errorData.message || "Неверный логин или пароль";
        return;
      }

      const authData: AuthResponse = await authRes.json();
      if (!authData.access.token) {
        error = "Ошибка входа";
        return;
      }

      const token = authData.access.token;
      const expiresAt = Date.now() + authData.access.lifeTime * 1000;

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("authExpiresAt", expiresAt.toString());
        push("/");
      }
    } catch (err) {
      console.log(err);
    }
  }
</script>

<div>
  <h1 class="mb-6">Вход в базу данных</h1>

  <div class="mx-auto my-0 min-w-[400px] max-w-[500px] max-md:min-w-full">
    <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-3">
      <div class="mb-2 flex flex-col items-start gap-1">
        <label for="login">Логин</label>
        <input
          class="border rounded-md p-2 size-full"
          id="login"
          type="text"
          bind:value={login}
          required
        />
      </div>

      <div class="mb-2 flex flex-col items-start gap-1">
        <label for="password">Пароль</label>
        <input
          class="border rounded-md p-2 size-full"
          id="password"
          type="password"
          bind:value={password}
          required
        />
      </div>

      {#if error}
        <div class="text-red-500 text-left">{error}</div>
      {/if}

      <button class="mt-3" type="submit">Войти</button>
    </form>
  </div>
</div>
