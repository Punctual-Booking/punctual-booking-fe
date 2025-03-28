import * as bcryptjs from 'bcryptjs'

/**
 * Password Security Utilities
 *
 * IMPORTANT SECURITY NOTICE:
 *
 * This file implements client-side password hashing for transport security.
 * This is an additional security layer ON TOP OF HTTPS, not a replacement.
 *
 * The backend MUST:
 * 1. Accept these client-side hashed passwords
 * 2. Re-hash them with a different salt and higher work factor before storing
 * 3. Use proper cryptographic techniques for password verification
 *
 * This approach protects passwords during transmission in case of:
 * - TLS/HTTPS termination at a proxy before the backend
 * - Logging of request bodies in dev environments
 * - MITM attacks in development or compromised networks
 *
 * Do not remove this security layer without implementing an equivalent or better solution.
 */

/**
 * Hashes a password using bcryptjs for client-side transport security
 * Note: The server should rehash with a different salt before storing
 * @param password The plain text password to hash
 * @returns A promise that resolves to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Use a lower cost factor for client-side hashing (server should use higher)
  const salt = await bcryptjs.genSalt(5)
  return bcryptjs.hash(password, salt)
}

/**
 * Hashes the client password and the confirmation password
 * @param password The plain text password
 * @param confirmPassword The plain text confirmation password
 * @returns A promise that resolves to both hashed passwords
 */
export const hashPasswords = async (
  password: string,
  confirmPassword: string
): Promise<{ hashedPassword: string; hashedConfirmPassword: string }> => {
  const [hashedPassword, hashedConfirmPassword] = await Promise.all([
    hashPassword(password),
    hashPassword(confirmPassword),
  ])

  return { hashedPassword, hashedConfirmPassword }
}
