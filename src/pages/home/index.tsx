import type { IBigNumber, ModalType } from '../../types/charts';
import styles from './home.module.css';
import {
    atmIcon,
    posIcon,
    shieldIcon,
    approvedShieldIcon,
    mapIcon,
} from '../../utils/icons';
import logo from '../../assets/humo-logo.png';
import { BigNumber } from '../../components/charts/big_number';
import { PieChart } from '../../components/charts/pie_chart';
import { BarWithAxisLine } from '../../components/charts/bar_with_axis';
import { CountryMapChart } from '../../components/charts/country_map';
import { useState } from 'react';
import { Modal } from '../../components/_modal';
import { BN_POS_Modal } from '../../components/_modal/contents/bn_pos';
import { BN_ATM_Modal } from '../../components/_modal/contents/bn_atm';
import { BN_CMRegion_Modal } from '../../components/_modal/contents/cm_regions';
import { BarWithLineLogariphmic } from '../../components/charts/bar_with_line_log';

const cards: IBigNumber[] = [
    {
        icon: posIcon,
        value: '89.2',
        unit: '%',
        label: 'POS активных',
        description: '38 141 из 42 764',
        modal: 'pos',
    },
    {
        icon: atmIcon,
        value: '92.1',
        unit: '%',
        label: 'ATM активных',
        description: '5 894 из 6 400',
        modal: 'atm',
    },
    {
        icon: shieldIcon,
        value: '98.4',
        unit: '%',
        label: 'AFS · проверено',
        description: 'транзакций охвачено',
    },
    {
        icon: approvedShieldIcon,
        value: '99.1',
        unit: '%',
        label: 'AFS · одобрено',
        description: 'из проверенных',
    },
];

export const Home = () => {
    const [modal, setModal] = useState<ModalType>(null);

    return (
        <>
            <div className="container container-xl">

                <div className={styles.container_top}>

                    <button className="logo-tile">
                        <img src={logo} alt="HUMO logo" />
                    </button>

                    {cards.map((card, index) => (
                        <BigNumber
                            key={index}
                            props={{
                                ...card,
                                setModal,
                            }}
                        />
                    ))}

                </div>

                <div className={styles.container_grid}>
                    <div className={styles.map_parent}>
                        <CountryMapChart
                            props={{
                                title: 'Региональное распределение',
                                description:
                                    'объём транзакций на душу населения · млн сум / чел.',
                                modal: 'cm_regions',
                                setModal
                            }}
                        />
                    </div>
                    <div className={styles.container_grid_children}>
                        <BarWithAxisLine
                            props={{
                                title: 'План-Факт P&L',
                                description: 'млрд сум · с января 2025',
                            }}
                        />
                        <BarWithLineLogariphmic
                            props={{
                                title: 'Объём транзакций на кол-во POS',
                                description:
                                    'объём транзакций и активные POS · с января 2025',
                            }}
                        />
                        <BarWithAxisLine
                            props={{
                                title: 'Кол-во выпущенных и активных карт',
                                description: 'млн карт · тыс. выпуск',
                            }}
                        />
                        <PieChart
                            props={{
                                title: 'Способ оплаты, тек. год',
                                description:
                                    '% от всех транзакций · Июль 2026',
                            }}
                        />
                    </div>
                </div>
            </div>

            {modal && (
                <Modal
                    open={modal !== null}
                    onClose={() => setModal(null)}
                >
                    {modal === 'pos' && (
                        <BN_POS_Modal
                            title='POS-терминалы · активность парка'
                            description='подключено и активных · тыс. устройств · 12 месяцев'
                            note='Активным считается терминал с операцией за последние 30 дней. Провал активности в Янв — сезонный.'
                            icon={posIcon}
                        />
                    )}

                    {modal === 'atm' && (
                        <BN_ATM_Modal
                            title='Банкоматы · активность парка'
                            description='подключено и активных · устройств · 12 месяцев'
                            note='Активным считается ATM с успешной операцией за последние 7 дней. Аптайм считается по телеметрии мониторинга.'
                            icon={atmIcon}
                        />
                    )}

                    {modal === 'cm_regions' && (
                        <BN_CMRegion_Modal
                            title='Регионы Узбекистана · детализация'
                            description='объём транзакций на душу населения · млн сум / чел. · текущий месяц · все 14 регионов'
                            note='Нормировка на постоянное население меняет картину: Бухара поднимается с 7-го места на 3-е, Навои — с 13-го на 8-е, а Кашкадарья опускается с 8-го на 12-е. Наведение на карту показывает подушевой объём, абсолютный объём и население региона.'
                            icon={mapIcon}
                        />
                    )}
                </Modal>
            )}
        </>
    );
};