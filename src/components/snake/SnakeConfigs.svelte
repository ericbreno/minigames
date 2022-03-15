<script lang="ts">
  import type { SnakeConfigType } from './SnakeCore'

  export let value: SnakeConfigType
</script>

<div class="wrapper">
  <label for="infinite-board">
    <input name="infinite-board" type=checkbox bind:checked={value.infiniteBoard} />
    Infinite Board
  </label>

  <label for="fast">
    <input name="fast" type=checkbox bind:checked={value.fast} />
    Fast Snake
  </label>

  <label for="small-board">
    <input name="small-board" type=checkbox bind:checked={value.smallBoard} />
    Small Board
  </label>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    margin-top: 1.25rem;
  }

  label {
    margin-bottom: .5rem;
  }

  input {
    transform: scale(1.5);
  }
</style>