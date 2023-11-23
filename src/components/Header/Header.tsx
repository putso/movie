import { Tabs, TabsProps } from 'antd';
import React from 'react';
import style from './Header.module.scss';
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
      <div className={style.container}>
        <Tabs defaultActiveKey={'Search'} centered items={items} onChange={(key: string) => setTab(key as tab)} />
      </div>
    </div>
  );
};

export default Heades;
