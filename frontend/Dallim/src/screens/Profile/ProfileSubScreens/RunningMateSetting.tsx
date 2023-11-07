import * as S from './RunningMateSetting.styles';
import {useEffect, useState} from 'react';

//icon
import BackButtonIcon from '@/assets/icons/ArrowLeft';

//carousel
import Carousel from '@/components/profileComponent/Carousel';
import {Dimensions} from 'react-native';

//component
import RunningMateDeleteModal from '@/components/profileComponent/profileModal/RunningMateDeleteModal';
import {useRecoilValue} from 'recoil';
import {competitorDataState} from '@/recoil/RunningRecoil';

interface CompetitorDataType {
  userId: number;
  id: string;
  nickName: string;
  characterIndex: number;
  evolutionStage: number;
  planetIndex: number;
  level: number;
  averagePace: number;
  totalDistance: number;
  totalTime: number;
  createdAt: string;
  clear: boolean;
}

interface RunningMateSettingProps {
  navigation: any;
}

function RunningMateSetting({navigation}: RunningMateSettingProps) {
  // 다음 화면 미리보기--------------------
  const screenWidth = Dimensions.get('window').width;

  // state--------------------
  const competitorData = useRecoilValue(competitorDataState);

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const [selectedCardNum, setSelectedCardNum] = useState<number | null>(
    1 || null,
  );

  // 선택(런닝메이트) Id
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<
    string | null
  >(null);

  //useEffect

  //action
  const showDeleteModal = () => {
    if (selectedCardNum !== null) {
      const currentCompetitorId = competitorData[selectedCardNum]?.id;
      if (currentCompetitorId) {
        setSelectedCompetitorId(currentCompetitorId);
        setDeleteModalVisible(true);
      }
    }
  };

  return (
    <S.Container>
      <S.BackgroundImage
        source={require('@/assets/images/MainBackground4.png')}
        resizeMode="cover">
        <S.Header>
          <S.BackButtonFlexBoxLeft
            onPress={() => navigation.navigate('Profile')}>
            <BackButtonIcon width={30} height={30} color="white" />
          </S.BackButtonFlexBoxLeft>
          <S.BackButtonFlexBoxRight>
            <S.TitleText>러닝메이트 설정</S.TitleText>
          </S.BackButtonFlexBoxRight>
          <S.BackButtonFlexBoxLeft></S.BackButtonFlexBoxLeft>
        </S.Header>

        <S.Body>
          <Carousel
            gap={16}
            offset={36}
            competitorData={competitorData}
            pageWidth={screenWidth - (16 + 36) * 2}
            onCardSelected={(index: number) => setSelectedCardNum(index)}
          />
        </S.Body>
        <S.Footer>
          <S.FooterTopBox></S.FooterTopBox>
          <S.DeleteButtonMiddleBox onPress={showDeleteModal}>
            <S.DeleteButtonText>삭제</S.DeleteButtonText>
          </S.DeleteButtonMiddleBox>
          <S.FooterBottomBox></S.FooterBottomBox>
        </S.Footer>
        <S.TabBox />
        {isDeleteModalVisible && selectedCompetitorId && (
          <RunningMateDeleteModal
            competitorId={selectedCompetitorId}
            toggleDeleteModal={() => setDeleteModalVisible(false)}
          />
        )}
      </S.BackgroundImage>
    </S.Container>
  );
}

export default RunningMateSetting;
