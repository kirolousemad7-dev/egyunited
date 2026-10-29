(function () {
  var form = document.querySelector("#quote form");
  var copyNode = document.getElementById("form-copy");
  if (!form || !copyNode) return;
  var copy = JSON.parse(copyNode.textContent);
  var status = document.querySelector(".status");

  function western(value) {
    var indic = "٠١٢٣٤٥٦٧٨٩";
    var persian = "۰۱۲۳۴۵۶۷۸۹";
    return value
      .replace(/[٠-٩]/g, function (digit) { return String(indic.indexOf(digit)); })
      .replace(/[۰-۹]/g, function (digit) { return String(persian.indexOf(digit)); });
  }

  function phone(value) {
    var digits = western(value).replace(/\D/g, "");
    if (digits.indexOf("0020") === 0) digits = digits.slice(4);
    else if (digits.indexOf("20") === 0) digits = "0" + digits.slice(2);
    return digits;
  }

  function setError(name, message) {
    var field = form.elements[name];
    var error = document.getElementById("lead-" + name + "-error");
    if (field) field.classList.toggle("invalid", Boolean(message));
    if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message || "";
    return message;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      governorate: form.elements.governorate.value,
      service: form.elements.service.value,
      building: form.elements.building.value,
      details: form.elements.details.value.trim()
    };
    var first = "";
    function check(name, message) {
      setError(name, message);
      if (message && !first) first = name;
    }
    check("name", data.name.length < 3 ? copy.errors.nameMin : data.name.length > 80 ? copy.errors.nameMax : "");
    check("phone", !data.phone ? copy.errors.phoneRequired : !/^01[0125]\d{8}$/.test(phone(data.phone)) ? copy.errors.phoneInvalid : "");
    check("governorate", copy.governorates[data.governorate] ? "" : copy.errors.governorate);
    check("service", copy.services[data.service] ? "" : copy.errors.service);
    check("building", copy.buildings[data.building] ? "" : copy.errors.building);
    check("details", data.details.length < 10 ? copy.errors.detailsMin : data.details.length > 800 ? copy.errors.detailsMax : "");
    if (first) {
      var invalid = document.getElementById("lead-" + first);
      if (invalid) invalid.focus();
      return;
    }

    var lines = [
      copy.heading,
      "",
      copy.labels.name + ": " + data.name,
      copy.labels.phone + ": " + phone(data.phone),
      copy.labels.governorate + ": " + copy.governorates[data.governorate],
      copy.labels.service + ": " + copy.services[data.service],
      copy.labels.building + ": " + copy.buildings[data.building],
      copy.labels.details + ": " + data.details
    ];
    var url = "https://wa.me/201210442451?text=" + encodeURIComponent(lines.join("\n"));
    if (status) {
      status.hidden = false;
      status.innerHTML = "";
      var parts = copy.success.split(/<link>|<\/link>/);
      status.append(document.createTextNode(parts[0] || ""));
      if (parts.length > 1) {
        var anchor = document.createElement("a");
        anchor.href = url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = parts[1] || "";
        status.append(anchor);
        status.append(document.createTextNode(parts[2] || ""));
      }
    }
    var opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.assign(url);
  });
})();
