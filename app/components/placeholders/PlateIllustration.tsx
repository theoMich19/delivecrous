import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { COLORS } from '@/styles/global';

interface PlateIllustrationProps {
    width?: number;
    height?: number;
    style?: object;
}

const PlateIllustration: React.FC<PlateIllustrationProps> = ({
    width = 100,
    height = 100,
    style
}) => {
    const plateColor = COLORS.primary;
    const plateInnerColor = '#FFFFFF';
    const utensilHandleColor = COLORS.primary;
    const utensilHeadColor = '#D0D0D0';

    return (
        <View style={[{ width, height }, style]}>
            <Svg width="100%" height="100%" viewBox="0 0 120 120">
                {/* Fourchette (à gauche) */}
                <G transform="translate(20, 60)">
                    {/* Manche de la fourchette */}
                    <Path
                        d="M0,25 L0,-25"
                        stroke={utensilHandleColor}
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                    {/* Dents de la fourchette */}
                    <Path
                        d="M-8,-30 L8,-30 M-6,-40 L6,-40 M-4,-35 L4,-35"
                        stroke={utensilHeadColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </G>

                {/* Assiette (au centre) */}
                <Circle cx="60" cy="60" r="35" fill={plateColor} />
                <Circle cx="60" cy="60" r="30" fill={plateInnerColor} />

                {/* Couteau (à droite) */}
                <G transform="translate(100, 60)">
                    {/* Manche du couteau */}
                    <Path
                        d="M0,25 L0,-25"
                        stroke={utensilHandleColor}
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                    {/* Lame du couteau */}
                    <Path
                        d="M0,-30 L-8,-45 L8,-45 L0,-30"
                        fill={utensilHeadColor}
                        stroke={utensilHeadColor}
                        strokeWidth="1"
                    />
                </G>
            </Svg>
        </View>
    );
};

export default PlateIllustration;