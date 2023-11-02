import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import * as S from './UserDetailStack.styles';
import CloseIcon from '@/assets/icons/DirectionLeft_2.png';

import RunningDataBox from '@/components/socialComponent/RunningDataBox';
import VersusModal from '@/components/socialComponent/socialModal/VersusModal';
import SocialCard from '@/components/socialComponent/SocialCard';
import { characterData } from '@/recoil/CharacterData';
import { fetchUserRecord } from '@/apis/SocialApi';

interface UserDetailStackProps {
    navigation: any;
    route: {
        params: {
            userId: number;
        };
    };
}

interface RunningRecord {
    id: number;
    userId: number;
    location: string;
    createdAt: string;
    totalDistance: number;
    totalTime: number;
    averageSpeed: number;
    registration: boolean;
}

interface UserDetails {
    characterIndex: number;
    planetIndex: number;
    nickname: string;
    level: number;
    exp: number;
    evolutionStage: number;
    runningRecordOverviews: RunningRecord[];
}


function UserDetailStack({ navigation, route }: UserDetailStackProps) {
    const userId = route.params.userId;

    const [userDetails, setUserDetails] = useState<UserDetails | null>(null); // 타입을 명시적으로 선언

    const fetchUserDetails = async () => {
        try {
            const details: UserDetails = await fetchUserRecord(userId); // 타입을 명시적으로 선언
            setUserDetails(details); // 불러온 사용자 정보를 상태에 저장
        } catch (error) {
            console.error("Failed to fetch user details", error);
        }
    };
    useEffect(() => {
        fetchUserDetails();
    }, []);

    const selectedCharacterIndex = userDetails ? userDetails.characterIndex : 0;
    const selectedPlanetIndex = userDetails ? userDetails.planetIndex : 0;
    const selectedNickname = userDetails ? userDetails.nickname : '';
    const selectedLevel = userDetails ? userDetails.level : 0;
    const selectedExp = userDetails ? userDetails.exp : 0;
    const selectedEvolutionStage = userDetails ? userDetails.evolutionStage : 0;
    const runningRecords = userDetails ? userDetails.runningRecordOverviews : [];

    const selectedCharacter = characterData[selectedCharacterIndex];
    const selectedCharacterLevelData = selectedCharacter.levels[selectedEvolutionStage];

    function handleSend() {
        console.log("비교하기 버튼 확인");
        setVersusModalVisible(true);
    };

    // // 드롭다운
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedSort, setSelectedSort] = useState("최신 순서");

    // Versus 모달
    const [isVersusModalVisible, setVersusModalVisible] = useState(false);

    return (
        <S.Container>
            <S.BackgroundImage source={require('@/assets/images/MainBackground4.png')}
                resizeMode="cover">

                <S.Header>
                    <S.CloseButton onPress={() => navigation.goBack()}>
                        <S.CloseImage source={CloseIcon} />
                    </S.CloseButton>
                    <S.HeaderBox>
                        <S.DetailText>상세보기</S.DetailText>
                    </S.HeaderBox>
                    <S.Empty></S.Empty>
                </S.Header>
                <S.Body>
                    <S.ProfileBox>
                        <SocialCard
                            planetIndex={selectedPlanetIndex}
                            nickname={selectedNickname}
                            userLevel={selectedLevel}
                            experiencePercentage={selectedExp}
                        />
                    </S.ProfileBox>

                </S.Body>

                <S.Footer>
                    <S.FooterTop>
                        <S.RecordTitleBox>
                            <S.RecordTitle>달림기록</S.RecordTitle>
                        </S.RecordTitleBox>
                        <S.FooterLine>

                        </S.FooterLine>
                        <S.SortBox>
                            <S.Sort onPress={() => setDropdownVisible(!dropdownVisible)}>
                                <S.SortText>{selectedSort}</S.SortText>
                                {/* 드랍다운 예정 */}
                                {/* {dropdownVisible && (
                                    <S.DropdownMenu>
                                        <S.DropdownItem onPress={() => { setSelectedSort("최신순"); setDropdownVisible(false); }}><S.DropdownItemText>최신 순서</S.DropdownItemText></S.DropdownItem>
                                        <S.DropdownItem onPress={() => { setSelectedSort("속력순"); setDropdownVisible(false); }}><S.DropdownItemText>속력 순서</S.DropdownItemText></S.DropdownItem>
                                        <S.DropdownItem onPress={() => { setSelectedSort("운동시간순"); setDropdownVisible(false); }}><S.DropdownItemText>운동시간 순서</S.DropdownItemText></S.DropdownItem>
                                    </S.DropdownMenu>
                                )} */}
                            </S.Sort>
                        </S.SortBox>
                    </S.FooterTop>
                    <S.FooterList>
                        <ScrollView>
                            {runningRecords.map((record: RunningRecord, index: number) => (
                                <S.RunBox key={record.id}>
                                    <RunningDataBox {...record} />
                                </S.RunBox>
                            ))}
                        </ScrollView>
                    </S.FooterList>

                </S.Footer>

                <S.TabBox />
            </S.BackgroundImage>



            <S.ImageBox>
                <S.CharacterImage
                    source={selectedCharacterLevelData.front}
                    resizeMode="contain"
                />
            </S.ImageBox>

            <VersusModal
                isVisible={isVersusModalVisible}
                onClose={() => setVersusModalVisible(false)}
            />

        </S.Container >
    );
};

export default UserDetailStack;
