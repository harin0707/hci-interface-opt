import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { experimentIdState } from '../atoms.js';


export default function Condition1() {
    const router = useRouter();
    const { id } = router.query; // URL 파라미터 추출
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    const experimentId = useRecoilValue(experimentIdState);
    

    return (

        <Container>
            <div>Condition1 Page 기존 방식-  Task Num: 1</div>
            <div> 실험자: {experimentId || '정보 없음'}</div>

        </Container>

        





    )

}



const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin: 20px 0;
`;