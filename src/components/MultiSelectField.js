import React, { useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

function MultiSelectField({ options, label, name, defaultValue, onSelect }) {
  const [selectedValues, setSelectedValues] = useState([]);
  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    setSelectedValues(typeof value === "string" ? value.split(",") : value);
    e.target.value = selectedValues;
    const ev = {
      target: {
        value: value.map((v) => v.id),
        name,
      },
    };
    onSelect(ev);
  };
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selectedValues}
        onChange={handleChange}
        name={name}
        input={<OutlinedInput label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value.id} label={value.name_en} />
            ))}
          </Box>
        )}
      >
        {options.map((opt) => (
          <MenuItem key={opt.id} value={opt}>
            {opt.name_en}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MultiSelectField;
