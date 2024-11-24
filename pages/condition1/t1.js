import { useRouter } from 'next/router';
import styled from 'styled-components';

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

export default function Condition1() {
    const router = useRouter();
    const { id } = router.query; // URL 파라미터 추출
    if (router.isFallback) {
        return <div>Loading...</div>;
    }
    

    return (

        <h1>Condition1 Page 기존 방식-  Task Num: {id}</h1>



    )

}



const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin: 20px 0;
`;