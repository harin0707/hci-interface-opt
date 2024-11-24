    import { atom } from 'recoil';

    // 실험자 ID 상태
    export const experimentIdState = atom({
    key: 'experimentIdState',
    default: '', // 초기값: 빈 문자열
    });

    // 각 task의 상태
    export const taskState = atom({
    key: 'taskState',
    default: [
        {
        taskId: 1,
        conditions: [
            { conditionId: 1, totalClicks: 0, incorrectClicks: 0, timeSpent: 0 },
            { conditionId: 2, totalClicks: 0, incorrectClicks: 0, timeSpent: 0 },
            { conditionId: 3, totalClicks: 0, incorrectClicks: 0, timeSpent: 0 },
        ],
        },
        {
        taskId: 2,
        conditions: [
            { conditionId: 1, totalClicks: 0, incorrectClicks: 0, timeSpent: 0 },
            { conditionId: 2, totalClicks: 0, incorrectClicks: 0, timeSpent: 0 },
            { conditionId: 3, totalClicks: 0, incorrectClicks: 0, timeSpent: 0 },
        ],
        },
        {
        taskId: 3,
        conditions: [
            { conditionId: 1, totalClicks: 0, incorrectClicks: 0, timeSpent: 0 },
            { conditionId: 2, totalClicks: 0, incorrectClicks: 0, timeSpent: 0 },
            { conditionId: 3, totalClicks: 0, incorrectClicks: 0, timeSpent: 0 },
        ],
        },
    ], // 초기값: 각 task와 condition 초기화
    });
