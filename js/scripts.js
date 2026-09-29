
function lerNumero(id) {
  const el = document.getElementById(id);
  const v = parseFloat(el.value.replace(",", "."));
  return isNaN(v) || v < 0 ? null : v;
}
function formatar(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function mostrar(id, texto, negativo = false) {
  const box = document.getElementById(id);
  box.innerHTML = texto;
  box.classList.toggle("negativo", negativo);
}


function calcularOrcamento() {
  const total = lerNumero("orcTotal");
  const dias = lerNumero("orcDias");
  const custoDia = lerNumero("orcCustoDia");
  const reserva = lerNumero("orcReserva") || 0;

  if (total === null || dias === null || dias === 0 || custoDia === null) {
    mostrar("res51", "⚠️ Preencha todos os campos com valores válidos.", true);
    return;
  }

  const gastoPrevisto = custoDia * dias + reserva;
  const sobra = total - gastoPrevisto;
  const diariaSobra = sobra / dias;

  let html = `Custo previsto: <strong>${formatar(gastoPrevisto)}</strong><br>
              Sobras/dia: <strong>${formatar(diariaSobra)}</strong><br>`;
  html += sobra >= 0
    ? `✅ Sobra no orçamento: <strong>${formatar(sobra)}</strong>. Bora ali!`
    : `❌ Orçamento estourado em <strong>${formatar(Math.abs(sobra))}</strong>.`;
  mostrar("res51", html, sobra < 0);
}


function converterMoeda() {
  const brl = lerNumero("convBRL");
  const taxa = lerNumero("convTaxa");
  const moeda = document.getElementById("convMoeda").value;

  if (brl === null || taxa === null || taxa === 0) {
    mostrar("res52", "⚠️ Informe o valor e uma taxa de câmbio válida.", true);
    return;
  }

  const convertido = brl / taxa;
  const simbolo = { USD: "$", EUR: "€", ARS: "$" }[moeda];
  mostrar("res52",
    `Com a taxa <strong>1 ${moeda} = R$ ${taxa}</strong>:<br>
     <strong>${formatar(brl)}</strong> = <strong>${simbolo} ${convertido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ${moeda}</strong>`);
}


function calcularHospedagem() {
  const diaria = lerNumero("hosDiaria");
  const noites = lerNumero("hosNoites");
  const quartos = lerNumero("hosQuartos");
  const limpeza = lerNumero("hosLimpeza") || 0;

  if (diaria === null || noites === null || quartos === null) {
    mostrar("res53", "⚠️ Preencha diária, noites e quartos.", true);
    return;
  }

  const total = diaria * noites * quartos + limpeza;
  mostrar("res53",
    `Diária x noites x quartos: ${formatar(diaria)} × ${noites} × ${quartos}<br>
     Taxa de limpeza: ${formatar(limpeza)}<br>
     <strong>Total da hospedagem: ${formatar(total)}</strong>`);
}


function calcularGastos() {
  const orc = lerNumero("gasOrcamento");
  const hos = lerNumero("gasHospedagem") || 0;
  const ali = lerNumero("gasAlimentacao") || 0;
  const tra = lerNumero("gasTransporte") || 0;
  const pas = lerNumero("gasPasseios") || 0;

  if (orc === null) {
    mostrar("res54", "⚠️ Informe o orçamento total.", true);
    return;
  }

  const total = hos + ali + tra + pas;
  const saldo = orc - total;
  const pct = orc > 0 ? Math.round((total / orc) * 100) : 0;

  let html = `Total planejado: <strong>${formatar(total)}</strong> (${pct}% do orçamento)<br>`;
  html += saldo >= 0
    ? `✅ Saldo disponível: <strong>${formatar(saldo)}</strong>.`
    : `❌ Faltam <strong>${formatar(Math.abs(saldo))}</strong>.`;
  mostrar("res54", html, saldo < 0);
}


function calcularRanking() {
  const nomes = [];
  const notas = [];
  let preenchido = 0;

  for (let i = 1; i <= 3; i++) {
    const nome = document.getElementById(`rkNome${i}`).value.trim();
    const custo = lerNumero(`rkCusto${i}`);
    const praia = lerNumero(`rkPraia${i}`);
    const cultura = lerNumero(`rkCultura${i}`);
    if (nome && custo !== null && praia !== null && cultura !== null) {
      nomes.push(nome);
      notas.push((custo + praia + cultura) / 3);
      preenchido++;
    }
  }

  if (preenchido === 0) {
    mostrar("res55", "⚠️ Preencha pelo menos um destino com todas as notas (0 a 10).", true);
    return;
  }

  const ordem = nomes.map((n, i) => ({ n, m: notas[i] }))
    .sort((a, b) => b.m - a.m);

  let html = "🏆 <strong>Ranking BORA ALI:</strong><ol class='mb-0'>";
  ordem.forEach((d, i) => {
    const medalha = ["🥇", "🥈", "🥉"][i] || "🏅";
    html += `<li>${medalha} <strong>${d.n}</strong> — nota ${d.m.toFixed(1)}/10</li>`;
  });
  html += "</ol>";
  mostrar("res55", html);
}