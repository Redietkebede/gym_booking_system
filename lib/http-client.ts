export function assertResponseOk(response: Response, message: string) {
  if (!response.ok) {
    throw new Error(message);
  }
}

export function reportClientError(error: unknown) {
  console.error(error);
}
