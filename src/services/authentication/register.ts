export const register = async (name: string, email: string, password: string) => {
  const response = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })
  
  console.log(response) // TODO: Remove this
}
