<script lang="ts">
  import { replace } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { isTokenValid, clearAuth } from "../auth";

  import type { DataRecord } from "../types";

  let apiData: DataRecord[] = [],
    currentPage = 1,
    search = "";

  $: headers =
    apiData.length > 0 ? (Object.keys(apiData[0]) as (keyof DataRecord)[]) : [];

  function formatDate(value: string): string {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  async function getRecords(page: number, query: string = search) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(query && { search: query })
      });

      const dataRes = await fetch(`/api/imdg?${params}`, {
        method: "GET",
        headers: { Token: `${localStorage.getItem("authToken")}` },
      });

      const result = await dataRes.json();
      apiData = result;
      currentPage = page;
    } catch (err) {
      console.log(err);
    }
  }

  function handleSearch() {
    currentPage = 1;
    getRecords(currentPage, search);
  }

  onMount(() => {
    if (!isTokenValid()) {
      clearAuth();
      replace('/login');
    }

    getRecords(currentPage);
  });
</script>

<div>
  <h1 class="mb-4">Реестр данных</h1>

  <div class="m-0-auto max-w-1680">
    <div class="mb-6 flex items-start">
      <input
        type="text"
        class="border rounded-md p-2 w-80 max-md:w-full"
        placeholder="Поиск..."
        bind:value={search}
        on:input={handleSearch}
      />
    </div>

    <div class="overflow-x-auto">
      {#if headers.length}
        <table class="border border-separate border-spacing-0">
          <thead>
            <tr class="bg-gray">
              {#each headers as header}
                <th
                  class="border p-2 max-md:p-1 text-center min-w-25
                    {header === 'name' ? 'min-w-120' : ''}
                    {header === 'uuid' ? 'min-w-60' : ''}
                    {header === 'col19' ? 'min-w-50' : ''}
                    {header === headers[0] ? 'sticky left-0 bg-[#313133]' : ''}"
                  >{header}</th
                >
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each apiData as item (item.id)}
              <tr class="">
                {#each headers as header}
                  <td
                    class="border p-2 max-md:p-1
                      {header === headers[0] ? 'sticky left-0 bg-[#313133]' : ''}
                    "
                  >
                    {#if header === "createdAt" || header === "updatedAt"}
                      {formatDate(item[header])}
                    {:else}
                      {item[header]}
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      {:else}
        <div class="text-left">Нет записей с такими параметрами</div>
      {/if}
    </div>
  </div>

  <div class="mt-6 flex justify-between">
    {#if currentPage > 1}
      <button on:click={() => getRecords(currentPage - 1)}>&lt;</button>
    {/if}
    <button class="ml-auto" on:click={() => getRecords(currentPage + 1)}
      >&gt;</button
    >
  </div>
</div>
