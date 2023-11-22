import { Input } from 'antd';
import React from 'react';

const Search = ({ query, onChange }: { query: string; onChange: (query: string) => void }) => {
  return (
    <div>
      <Input value={query} onChange={(e) => onChange(e.target.value)} placeholder="Find movie" />
    </div>
  );
};

export default Search;
