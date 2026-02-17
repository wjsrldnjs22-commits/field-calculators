(function () {
  const $ = (id) => document.getElementById(id);

  const els = {
    w: $("widthCm"),
    l: $("lengthCm"),
    h: $("heightCm"),
    q: $("qty"),
    divisorPreset: $("divisorPreset"),
    divisorCustom: $("divisorCustom"),
    btnCalc: $("btnCalc"),
    btnReset: $("btnReset"),
    btnExample: $("btnExample"),
    outCbm: $("outCbm"),
    outDim: $("outDim"),
    error: $("error"),
    noteDiv: $("noteDiv"),
  };

  function getDivisor() {
    const preset = els.divisorPreset.value;
    if (preset === "custom") {
      return Number(els.divisorCustom.value);
    }
    return Number(preset);
  }

  function setError(msg) {
    els.error.textContent = msg || "";
  }

  function fmt(n, digits) {
    if (!Number.isFinite(n)) return "—";
    return n.toFixed(digits);
  }

  function calc() {
    setError("");

    const w = Number(els.w.value);
    const l = Number(els.l.value);
    const h = Number(els.h.value);
    const q = Number(els.q.value);

    const divisor = getDivisor();

    // 입력 검증
    const mustBePositive = [w, l, h, q, divisor];
    if (mustBePositive.some((x) => !Number.isFinite(x))) {
      setError("숫자로 입력해줘 (예: 50, 40, 30).");
      return;
    }
    if (mustBePositive.some((x) => x <= 0)) {
      setError("0보다 큰 값만 입력해줘.");
      return;
    }

    // 계산
    // cm³ → m³ 변환: 1 m³ = 1,000,000 cm³
    const volumeCm3 = w * l * h * q;
    const cbm = volumeCm3 / 1_000_000;
    const dimWeightKg = volumeCm3 / divisor;

    els.outCbm.textContent = fmt(cbm, 3) + " m³";
    els.outDim.textContent = fmt(dimWeightKg, 1) + " kg";

    // 참고 문구
    els.noteDiv.innerHTML = `
      <div class="notice">
        💡 보통 운임은 <b>실중량</b>과 <b>부피중량</b> 중 더 큰 값(청구무게) 기준인 경우가 많아.<br/>
        ⚠️ 분모(예: 5000/6000)·반올림 규칙은 운송사/서비스마다 달라질 수 있으니 계약/요율표를 우선으로 봐줘.
      </div>
    `;
  }

  function reset() {
    setError("");
    els.w.value = "";
    els.l.value = "";
    els.h.value = "";
    els.q.value = "1";
    els.divisorPreset.value = "6000";
    els.divisorCustom.value = "";
    els.divisorCustom.disabled = true;
    els.outCbm.textContent = "—";
    els.outDim.textContent = "—";
    els.noteDiv.innerHTML = "";
  }

  function applyExample() {
    els.w.value = "50";
    els.l.value = "40";
    els.h.value = "30";
    els.q.value = "1";
    els.divisorPreset.value = "6000";
    els.divisorCustom.value = "";
    els.divisorCustom.disabled = true;
    calc();
  }

  function onDivisorPresetChange() {
    const preset = els.divisorPreset.value;
    const isCustom = preset === "custom";
    els.divisorCustom.disabled = !isCustom;
    if (!isCustom) {
      els.divisorCustom.value = "";
    }
  }

  // 이벤트 연결
  els.btnCalc.addEventListener("click", calc);
  els.btnReset.addEventListener("click", reset);
  els.btnExample.addEventListener("click", applyExample);
  els.divisorPreset.addEventListener("change", onDivisorPresetChange);

  // 초기 상태
  onDivisorPresetChange();
  reset();
})();
