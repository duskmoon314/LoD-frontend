<svelte:head>
  <script async lang="js">
    var remark_config = {
      host: "https://remark42.duskmoon314.com",
      site_id: "lod",
      components: ["embed"],
      theme: localStorage.getItem("theme") === "night" ? "dark" : "light",
      locale: document.documentElement.lang,
    }

    !(function (e, n) {
      for (var o = 0; o < e.length; o++) {
        var r = n.createElement("script"),
          c = ".js",
          d = n.head || n.body
        "noModule" in r ? ((r.type = "module"), (c = ".mjs")) : (r.async = !0),
          (r.defer = !0),
          (r.src = remark_config.host + "/web/" + e[o] + c),
          d.appendChild(r)
      }
    })(remark_config.components || ["embed"], document)
  </script>
</svelte:head>

<div id="remark42" />
