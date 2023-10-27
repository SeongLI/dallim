import React from 'react';
import * as S from './ProfileCard.styles';
import { roomData } from '../../components/editComponent/RoomData';

interface Props {
    RoomIndex: number;
    Nickname: string;
    UserLevel: number;
    experiencePercentage: number
}

function ProfileCard({ RoomIndex, Nickname, UserLevel, experiencePercentage }: Props) {

    return (
        <S.Container>
            <S.CardBox source={roomData[RoomIndex].ThemeCard} resizeMode="cover" >

                <S.Header>
                    <S.LevelText>Level {UserLevel}</S.LevelText>
                </S.Header>
                <S.Body>
                    <S.LeftBox>
                        <S.NicknameText>{Nickname}</S.NicknameText>
                    </S.LeftBox>
                    <S.RightBox>
                        <S.percentageText>{experiencePercentage}%</S.percentageText>
                    </S.RightBox>
                </S.Body>
                <S.Footer>
                    <S.ExperienceBox>
                        <S.Experience percentage={experiencePercentage}></S.Experience>
                    </S.ExperienceBox>
                </S.Footer>
            </S.CardBox>
        </S.Container>
    );
}

export default ProfileCard;
