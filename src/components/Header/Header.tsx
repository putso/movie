import { Tabs, TabsProps } from 'antd';
import React from 'react';
import './Header.scss';
import { tab } from '@/type';
const Heades = ({ setTab }: { setTab: (value: tab) => void }) => {
  const items: TabsProps['items'] = [
    {
      key: 'Search',
      label: 'Search',
      children: '',
    },
    {
      key: 'Rated',
      label: 'Rated',
      children: '',
    },
  ];
  return (
    <div>
      <div className="container123">
        <Tabs defaultActiveKey={'Search'} centered items={items} onChange={(key: string) => setTab(key as tab)} />
      </div>
    </div>
  );
};

export default Heades;
