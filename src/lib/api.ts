export const fetchTodos = async (token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const addTodo = async (title: string,token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todo`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title }),
  });
  const data = await res.json(); 
  if (!res.ok) throw new Error(data.message);
 
  return data;
};

export const deleteTodo = async (id: string,token: string) => {
  const res = await fetch(
    `${`${process.env.NEXT_PUBLIC_API_URL}`}/delete/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const toggleTodo = async (id: string, completed: boolean, token:string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ completed: !completed }),
  });
  const data = await res.json(); 
  if (!res.ok) throw new Error(data.message);

  return data;
};

export const updateTodo = async (id: string, title: String, token:string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}` ,
    },
    body: JSON.stringify({ title }),
  });
  const data = await res.json(); 
  if (!res.ok) throw new Error(data.message);

  return data;
};

export async function registerUser(email: string, password: string ) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({email,password}),
  });
  const data = await res.json(); 
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function loginUser(email: string, password: string ) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({email,password}),
  });
  const data = await res.json(); 
  if (!res.ok) throw new Error(data.message);

  return data;
}
