export const login = async (email: string, password: string) => {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  console.log(response) // TODO: Remove this
}
