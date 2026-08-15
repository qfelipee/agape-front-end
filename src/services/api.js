const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function login(email, senha) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.mensagem || "Erro ao fazer login");
  }

  return response.json();
}

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getDashboard(token, { mes, ano } = {}) {
  const params = new URLSearchParams();
  if (mes) params.append("mes", mes);
  if (ano) params.append("ano", ano);

  const query = params.toString();
  const url = `${API_URL}/lancamentos/dashboard${query ? `?${query}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.mensagem || "Erro ao buscar dashboard");
  }

  return response.json();
}

export async function getLancamentos(token, { tipo, dataInicio, dataFim, page = 0, size = 10 } = {}) {
  const params = new URLSearchParams();
  if (tipo) params.append("tipo", tipo);
  if (dataInicio) params.append("dataInicio", dataInicio);
  if (dataFim) params.append("dataFim", dataFim);
  params.append("page", page);
  params.append("size", size);

  const response = await fetch(`${API_URL}/lancamentos?${params.toString()}`, {
    method: "GET",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.mensagem || "Erro ao buscar lançamentos");
  }

  return response.json();
}

export async function createLancamento(token, dados) {
  const response = await fetch(`${API_URL}/lancamentos`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.mensagem || "Erro ao criar lançamento");
  }

  return response.json();
}

export async function updateLancamento(token, id, dados) {
  const response = await fetch(`${API_URL}/lancamentos/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.mensagem || "Erro ao editar lançamento");
  }

  return response.json();
}

export async function deleteLancamento(token, id) {
  const response = await fetch(`${API_URL}/lancamentos/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.mensagem || "Erro ao excluir lançamento");
  }

  
}

export async function getUsuarios(token) {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.mensagem || "Erro ao buscar usuários");
  }

  return response.json();
}

export async function createUsuario(token, dados) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.mensagem || "Erro ao criar usuário");
  }

  return response.json();
}

export async function updateUsuario(token, id, dados) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.mensagem || "Erro ao editar usuário");
  }

  return response.json();
}

export async function deleteUsuario(token, id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.mensagem || "Erro ao excluir usuário");
  }
}

export async function getLancamentosParaExportar(token, { tipo, dataInicio, dataFim } = {}) {
  const resultado = await getLancamentos(token, {
    tipo,
    dataInicio,
    dataFim,
    page: 0,
    size: 10000,
  });
  return resultado.content;
}