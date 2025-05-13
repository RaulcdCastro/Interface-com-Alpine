function formulario() {
  return {
    nome: '',
    email: '',
    sucesso: false,
    erro: false,
    emailInvalido: false,
    carregando: false,

    async enviarFormulario() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(this.email)) {
        this.exibirErro('Formato de e-mail inválido.');
        return;
      }

      this.carregando = true;

      try {
        const resposta = await fetch("http://localhost:3000/verificar-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email })
        });

        const resultado = await resposta.json();

        if (!resultado.valid) {
          this.exibirErro('E-mail inválido ou suspeito.');
          return;
        }

        // Salvar no localStorage
        const lista = JSON.parse(localStorage.getItem('formDataList')) || [];
        lista.push({
          nome: this.nome,
          email: this.email
        });
        localStorage.setItem('formDataList', JSON.stringify(lista));

        this.sucesso = true;
        this.erro = false;
        this.emailInvalido = false;

        setTimeout(() => this.sucesso = false, 3000);

      } catch (erro) {
        console.error("Erro ao verificar o e-mail:", erro);
        this.exibirErro('Erro ao verificar o e-mail.');
      } finally {
        this.carregando = false;
      }
    },

    exibirErro(msg) {
      this.erro = true;
      this.emailInvalido = true;
      console.error(msg);
      setTimeout(() => {
        this.erro = false;
        this.emailInvalido = false;
      }, 3000);
    }
  };
}
