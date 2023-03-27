import React, { useEffect, useState } from 'react';
import { Image, ImageProps, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { Actionsheet, useDisclose, Box, Divider } from 'native-base'
import { SubTitle } from '../Typography';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from "react-i18next";


interface AvatarProps extends ImageProps {
    onChange?: (image: ImageOrVideo) => void;
    setpos: () => void;
    pos: number
}

export const Avatar = (props: AvatarProps) => {
    // const{source}=props;
    const [uri, setUri] = React.useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();

    function onOpen() {
        setIsOpen(true);
        props.setpos();
    }

    function onClose() {
        setIsOpen(false);
    }

    const chooseImage = () => {
        ImagePicker.openPicker({
            compressImageQuality: 0.4,
            height: 400,
            width: 400,
            cropping: true,
        })
            .then(image => {
                setUri(image.path);
                props.onChange?.(image);
            })
            .finally(onClose);

    };


    const openCamera = () => {
        ImagePicker.openCamera({
            compressImageQuality: 0.5,
            height: 300,
            width: 300,
            cropping: true,
        })
            .then(image => {
                setUri(image.path);
                props.onChange?.(image);

            })
            .finally(onClose);

    };

    useEffect(() => {
        setUri(props?.source?.uri)
    }, [props?.source])
    return (
        <View>
            <TouchableOpacity onPress={onOpen}>
                <Image
                    style={styles.avatar}
                    {...props}
                    source={uri ? { uri } : props.source}
                />
            </TouchableOpacity>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Box w="100%" h={120} px={4} py={4} justifyContent="center">
                        <View style={styles.block}>
                            <TouchableOpacity style={styles.button} onPress={chooseImage}>
                                <FontAwesome name='picture-o' size={40} color="black" />
                                <SubTitle style={{textAlign:'center'}}>{t("common:SELECT_GALLERY")}</SubTitle>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={openCamera}>
                                <FontAwesome name='camera' size={40} color="black" />
                                <SubTitle style={{textAlign:'center'}}>{t("common:CAMERA_ADD")}</SubTitle>
                            </TouchableOpacity>
                        </View>
                    </Box>
                </Actionsheet.Content>
            </Actionsheet>
        </View>
    );


};

const styles = StyleSheet.create({
    avatar: {
        height: 100,
        width: 100,
    },
    block: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        padding: 5,
        width:"40%",
        justifyContent: 'center',
        alignItems: 'center',
    }
});