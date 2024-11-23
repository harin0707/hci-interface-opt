import { useRouter } from 'next/router';
export async function getStaticPaths() {
    const ids = ['1', '2', '3']; // 동적 경로로 사용할 번호
    const paths = ids.map((id) => ({
        params: { id },
        }));
    
        return {
        paths,
        fallback: false, // 정의되지 않은 경로는 404 반환
        };
    }
    
    export async function getStaticProps({ params }) {
        return {
        props: {
            id: params.id,
        },
        }
    }


export default function Condition1() {
    const router = useRouter();
    const { id } = router.query; // URL 파라미터 추출

    return <h1>Condition2 Page 모드 분리 방식- Task Num: {id}</h1>;
}