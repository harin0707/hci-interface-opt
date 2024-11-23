import { useRouter } from 'next/router';

    export async function getStaticPaths() {
        // 동적 경로를 지정합니다.
        const paths = [
        { params: { id: '1' } },
        { params: { id: '2' } },
        { params: { id: '3' } },
        ];
    
        return {
        paths,
        fallback: false, // paths에 없는 경로는 404 반환
        };
    }
    
    export async function getStaticProps({ params }) {
        // params.id를 사용해 필요한 데이터를 가져옵니다.
        return {
        props: {
            id: params.id, // 동적 경로의 id 값 전달
        },
        };
    }

export default function Condition3() {
    const router = useRouter();
    const { id } = router.query; // URL 파라미터 추출

    return <h1>Condition3 Page 확대 버튼- Task Num: {id}</h1>;
}