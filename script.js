const cep = document.getElementById("cep");
const rua = document.getElementById("rua");
const bairro = document.getElementById("bairro");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");

// Formata o CEP enquanto o usuário digita: 00000-000
cep.addEventListener("input", function () {
  let valor = cep.value.replace(/\D/g, "").slice(0, 8);
  if (valor.length > 5) {
    valor = valor.slice(0, 5) + "-" + valor.slice(5);
  }
  cep.value = valor;
});

// Busca o endereço quando o usuário sai do campo CEP
cep.addEventListener("blur", buscarEndereco);

async function buscarEndereco() {
  const cepLimpo = cep.value.replace(/\D/g, "");

  // CEP precisa ter 8 dígitos
  if (cepLimpo.length !== 8) return;

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      alert("CEP não encontrado.");
      return;
    }

    rua.value = dados.logradouro || "";
    bairro.value = dados.bairro || "";
    cidade.value = dados.localidade || "";
    estado.value = dados.uf || "";

    // Dispara o evento para o label flutuante subir nos campos preenchidos
    [rua, bairro, cidade, estado].forEach(function (campo) {
      campo.dispatchEvent(new Event("input"));
    });

    document.getElementById("numero").focus();
  } catch (erro) {
    alert("Não foi possível buscar o endereço. Verifique sua conexão.");
  }
}
