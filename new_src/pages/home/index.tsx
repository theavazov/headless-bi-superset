import type { NewBigNumberType } from '../../api/types';
import styles from './home.module.css';
import logo from '../../assets/humo-logo.png';
import { BigNumber } from '../../components/charts/big_number';
import { PieChart } from '../../components/charts/pie_chart';
import { BarWithAxis } from '../../components/charts/bar_with_axis';
import { useEffect, useState } from 'react';
import { BarWithLineLogariphmic } from '../../components/charts/bar_with_line_log';
import { getChartResults } from '../../api/superset';
import { getBigNumberTrendline } from '../../utils/functions/getBigNumberTrendline';
import { ActiveTerminalsATM } from '../../components/charts/active_terminals_atm';
import { formatAmount } from '../../utils/functions/formatNumber';
import { login } from '../../api/auth';
import { TokenizationChart } from '../../components/charts/tokenization_chart';
import { ActiveCardsChart } from '../../components/charts/active_cards';
import { IssuedCardsChart } from '../../components/charts/issued_cards';
import { ActiveTerminalsPOS } from '../../components/charts/active_terminals_pos';

export const Home = () => {
    const [posBigNumber, setPosBigNumber] = useState<NewBigNumberType | null>(null);
    const [atmBigNumber, setAtmBigNumber] = useState<NewBigNumberType | null>(null);
    const [AVGSpendingPOS, setAVGSpendingPOS] = useState<NewBigNumberType | null>(null);
    const [AVGSpendingATM, setAVGSpendingATM] = useState<NewBigNumberType | null>(null);
    const [isPosLoading, setIsPosLoading] = useState<boolean>(true);
    const [isAtmLoading, setIsAtmLoading] = useState<boolean>(true);
    const [isAVGPOSSpendingLoading, setIsAVGPOSSpendingLoading] = useState<boolean>(true);
    const [isAVGATMSpendingLoading, setIsAVGATMSpendingLoading] = useState<boolean>(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                await login(
                    import.meta.env.VITE_SUPERSET_USER,
                    import.meta.env.VITE_SUPERSET_PASSWORD
                );

                setIsReady(true);

                await Promise.all([loadAVGLifeTime(), loadAVGSpending(), loadAVGSpendingPOS(), loadAVGSpendingATM()]);
            } catch (error) {
                console.error('Failed to initialize dashboard:', error);
                setIsPosLoading(false);
                setIsAtmLoading(false);
                setIsAVGPOSSpendingLoading(false);
                setIsAVGATMSpendingLoading(false);

            }
        };

        const loadAVGLifeTime = async (): Promise<void> => {
            try {
                const obj = await getChartResults<NewBigNumberType>(414);
                const data = obj.result[0]?.data;

                if (!data?.length) return;

                setPosBigNumber(
                    getBigNumberTrendline(
                        data.at(-1)?.trend,
                        data.at(-2)?.trend
                    )
                );
            } catch (error) {
                console.error('Failed to load loadAVGLifeTime chart data:', error);
            } finally {
                setIsPosLoading(false);
            }
        };

        const loadAVGSpending = async (): Promise<void> => {
            try {
                const obj = await getChartResults<NewBigNumberType>(415);
                const data = obj.result[0]?.data;

                if (!data?.length) return;

                setAtmBigNumber(
                    getBigNumberTrendline(
                        data.at(-1)?.trend,
                        data.at(-2)?.trend
                    )
                );
            } catch (error) {
                console.error('Failed to load loadAVGSpending chart data:', error);
            } finally {
                setIsAtmLoading(false);
            }
        };

        const loadAVGSpendingPOS = async (): Promise<void> => {
            try {
                const obj = await getChartResults<NewBigNumberType>(443);
                const data = obj.result[0]?.data;

                if (!data?.length) return;

                setAVGSpendingPOS(
                    getBigNumberTrendline(
                        data.at(-1)?.trend,
                        data.at(-2)?.trend
                    )
                );
            } catch (error) {
                console.error('Failed to load loadAVGSpendingPOS chart data:', error);
            } finally {
                setIsAVGPOSSpendingLoading(false);
            }
        };

        const loadAVGSpendingATM = async (): Promise<void> => {
            try {
                const obj = await getChartResults<NewBigNumberType>(444);
                const data = obj.result[0]?.data;

                if (!data?.length) return;

                setAVGSpendingATM(
                    getBigNumberTrendline(
                        data.at(-1)?.trend,
                        data.at(-2)?.trend
                    )
                );
            } catch (error) {
                console.error('Failed to load loadAVGSpendingATM chart data:', error);
            } finally {
                setIsAVGATMSpendingLoading(false);
            }
        };

        initialize();
    }, []);

    return (
        <>
            <div className="container container-xl">
                <div className={styles.container_top}>
                    <div className={styles.header}>
                        <img src={logo} alt="Logo" className={styles.logo} />
                        <div className={styles.tb_sep}></div>
                        <div className={styles.header_div}>
                            <p className={styles.tb_ttl}>Показатели компании</p>
                            <p className={styles.tb_sub}>Ключевые метрики HUMO · обновляется автоматически</p>
                        </div>
                    </div>
                    <div className={styles.container_grid}>
                        <BigNumber
                            props={{
                                value: `${formatAmount(Number(posBigNumber?.value))}`,
                                unit: '',
                                label: 'Среднее время жизни карты',
                                description: `${posBigNumber?.trend.toFixed(1)}% к пред. году.`,
                                isLoading: isPosLoading,
                                trend: posBigNumber?.trend || 0
                            }}
                        />
                        <BigNumber
                            props={{
                                value: `${formatAmount(Number(atmBigNumber?.value))}`,
                                unit: '',
                                label: 'Средние ежемесячные расходы по карте',
                                description: `${atmBigNumber?.trend.toFixed(1)}% к пред. мес.`,
                                isLoading: isAtmLoading,
                                trend: atmBigNumber?.trend || 0
                            }}
                        />
                        <BigNumber
                            props={{
                                value: `${formatAmount(Number(AVGSpendingPOS?.value))}`,
                                unit: '',
                                label: 'Средний оборот по POS-устройствам',
                                description: `${AVGSpendingPOS?.trend.toFixed(1)}% к пред. мес.`,
                                isLoading: isAVGPOSSpendingLoading,
                                trend: AVGSpendingPOS?.trend || 0
                            }}
                        />
                        <BigNumber
                            props={{
                                value: `${formatAmount(Number(AVGSpendingATM?.value))}`,
                                unit: '',
                                label: 'Средний оборот по ATM-устройствам',
                                description: `${AVGSpendingATM?.trend.toFixed(1)}% к пред. мес.`,
                                isLoading: isAVGATMSpendingLoading,
                                trend: AVGSpendingATM?.trend || 0
                            }}
                        />
                    </div>
                </div>
                <div className={styles.container_grid}>
                    {isReady && (
                        <BarWithAxis
                            props={{
                                title: 'Доходы, расходы и прибыль',
                                description: 'по месяцам, сум',
                                top_left: '01 · Финансы',
                                top_right: 'Последние 12 месяцев'
                            }}
                        />
                    )}
                    {isReady && (
                        <PieChart
                            props={{
                                title: 'Структура типов транзакций',
                                description: 'доля в количестве операций',
                                top_left: '02 · Эквайринг',
                                top_right: 'Накоп. тек. год'
                            }}
                        />
                    )}
                    {isReady && (
                        <ActiveTerminalsPOS
                            props={{
                                title: 'Активные POS-устройствам',
                                description: 'на конец месяца, шт.',
                                top_left: '03 · Устройства',
                                top_right: 'Последние 12 месяцев'
                            }}
                        />
                    )}
                    {isReady && (
                        <ActiveTerminalsATM
                            props={{
                                title: 'Активные банкоматы',
                                description: 'на конец месяца, шт.',
                                top_left: '04 · Устройства',
                                top_right: 'Последние 12 месяцев'
                            }}
                        />
                    )}
                    {isReady && (
                        <IssuedCardsChart
                            props={{
                                title: 'Ежемесячная эмиссия',
                                description: 'за месяц, шт.',
                                top_left: '05 · Эмиссия',
                                top_right: 'Последние 12 месяцев'
                            }}
                        />
                    )}
                    {isReady && (
                        <ActiveCardsChart
                            props={{
                                title: 'Активные карты',
                                description: 'на конец месяца, шт.',
                                top_left: '06 · Эмиссия',
                                top_right: 'Последние 12 месяцев'
                            }}
                        />
                    )}
                    {isReady && (
                        <BarWithLineLogariphmic
                            props={{
                                title: 'Оборот платежных систем на терминалах HUMO',
                                description: 'оборот на наших терминалах, сум',
                                top_left: '07 · Эквайринг',
                                top_right: 'Последние 12 месяцев'
                            }}
                        />
                    )}
                    {isReady && (
                        <TokenizationChart
                            props={{
                                title: 'Токенизированные платежи',
                                description: 'оборот по месяцам, сум',
                                top_left: '08 · Токенизация',
                                top_right: 'Последние 12 месяцев'
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
};