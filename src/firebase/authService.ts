const ADMIN_PIN = "1234"; // TODO: Change this to your desired PIN

export const verifyPin = (pin: string): boolean => {
  return pin === ADMIN_PIN;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('admin_authenticated') === 'true';
};

export const setAuthenticated = (value: boolean): void => {
  localStorage.setItem('admin_authenticated', value.toString());
};

export const logout = (): void => {
  localStorage.removeItem('admin_authenticated');
};
