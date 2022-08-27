<script lang="ts">
  import "iconify-icon"

  const theme = localStorage.getItem("theme")
</script>

<label class="btn btn-ghost btn-circle swap swap-rotate">
  <input
    type="checkbox"
    checked={theme === "night"}
    data-toggle-theme="night,winter"
  />
  <iconify-icon class="swap-on" width="24px" icon="icon-park-outline:moon" />
  <iconify-icon
    class="swap-off"
    width="24px"
    icon="icon-park-outline:sun-one"
  />
</label>
