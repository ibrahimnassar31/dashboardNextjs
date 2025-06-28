import { useState } from 'react';

export function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value);
  return { value, onChange, setValue };
}
