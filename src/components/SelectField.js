import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
function SelectField({ options, label, name, defaultValue, onSelect }) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select label={label} name={name} onChange={onSelect}>
        {options.map((opt, i) => (
          <MenuItem key={opt.id} value={opt.id}>
            {opt.name_en ? opt.name_en : opt.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectField;
