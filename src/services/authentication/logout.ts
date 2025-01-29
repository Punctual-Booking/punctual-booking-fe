export const logout = async () => {
  const response = await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
  })
}
