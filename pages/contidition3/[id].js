import { useRouter } from 'next/router';

export default function Condition1() {
    const router = useRouter();
    const { id } = router.query; // URL 파라미터 추출

    return <h1>Condition3 Page 확대 버튼- Task Num: {id}</h1>;
}