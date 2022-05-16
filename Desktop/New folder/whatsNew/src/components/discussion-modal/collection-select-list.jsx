import React from "react";

import {Checkbox, ListItemText, MenuItem, Select} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
    },
    transformOrigin: {
        vertical: "top",
        horizontal: "left"
    },
    getContentAnchorEl: null,
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const checkBoxStyles = () => ({
    root: {
        color: "#c8c8c8",
        "&$checked": {
            color: "#18B263",
        },
        "&$indeterminate": {
            color: "#18B263",
        },
        "& .MuiIconButton-label": {
            width: "16px",
            height: "16px",
        },
    },
    indeterminate: {
        color: "#18B263",
    },
    checked: {},
});
const CustomCheckbox = withStyles(checkBoxStyles)(Checkbox);
function CollectionSelectList(props) {
    const {handleChange, action, value, collectionsList, handleSelect} = props
    if (action === "move"){
        return (
            <Select
                labelId="select-collection-list"
                id="select-collection-list"
                onChange={handleChange}
                value={value}
                disableUnderline
            >
                {collectionsList.map((collection) => (
                    <MenuItem key={collection.id} value={collection.id}>
                        <ListItemText primary={collection.name} />
                    </MenuItem>
                ))}
            </Select>
        );
    }else{
        const valueName = collectionsList.filter(collection => value.includes(collection.id)).map(collection => collection.name)
        return (
            <Select
                labelId="select-collection-list"
                id="select-collection-list"
                multiple
                value={valueName}
                disableUnderline
                renderValue={(selected) => {
                    if (selected.length === 0) {
                        return <em>Select collection</em>;
                    }
                    return selected.join(', ');
                }}
                MenuProps={MenuProps}
                inputProps={{ 'aria-label': 'Without label' }}
            >
                {collectionsList.map((collection) => (
                    <MenuItem key={collection.id} value={collection.id} onClick={() => handleSelect(collection.id)}>
                        <CustomCheckbox checked={value.includes(collection.id)} />
                        <ListItemText primary={collection.name} />
                    </MenuItem>
                ))}
            </Select>
        );
    }
}

export default CollectionSelectList;
