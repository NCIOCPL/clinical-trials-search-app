import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Fieldset, Autocomplete } from '../../atomic';
import { searchPriorTherapyAction } from '../../../store/actionsV2';
import './PriorTherapy.scss';
import { useAppSettings } from '../../../store/store.js';

const PriorTherapy = ({ handleUpdate }) => {
	const placeholderText = 'Please enter 3 or more characters';
	const dispatch = useDispatch();

	const [{ helpUrl }] = useAppSettings();
	const { priorTherapy } = useSelector((store) => store.form);
	const { priorTherapyOptions } = useSelector((store) => store.cache);
	const priorTherapyOptionsData = priorTherapyOptions?.data ? priorTherapyOptions.data : [];

	const [priorTherapyVal, setPriorTherapyVal] = useState({ value: '' });

	useEffect(() => {
		if (priorTherapyVal.value.length > 2) {
			dispatch(searchPriorTherapyAction({ searchText: priorTherapyVal.value }));
		}
	}, [priorTherapyVal, dispatch]);

	const filterSelectedItems = (items = [], selections = []) => {
		if (!items.length || !selections.length) {
			return items;
		}
		return items.filter((item) => !selections.find((selection) => selection.name === item.name));
	};

	const applyOptionsFilterAndFormatting = (searchVal, item, isHighlighted) => {
		const searchStr = new RegExp('(^' + searchVal.value + '|\\s+' + searchVal.value + ')', 'i');
		const filteredSynonyms = Array.isArray(item.synonyms) ? item.synonyms.filter((synonym) => synonym.match(searchStr)) : [];
		const filteredSynonymsCount = filteredSynonyms.length;

		return (
			<div className={`cts-autocomplete__menu-item ${isHighlighted ? 'highlighted' : ''}`} key={item.codes[0]}>
				<div className="preferredName">
					{item.name}
					{item.category.indexOf('category') !== -1 ? ' (DRUG FAMILY)' : ''}
				</div>
				{filteredSynonymsCount > 0 && (
					<span className="synonyms">
						Other Names:{' '}
						<ol>
							{filteredSynonyms.map((synonym, i) => (
								<li
									key={i}
									dangerouslySetInnerHTML={{
										__html: synonym.match(searchStr) ? synonym.replace(searchStr, `<strong>$&</strong>`) : synonym,
									}}></li>
							))}
						</ol>
					</span>
				)}
			</div>
		);
	};

	return (
		<Fieldset
			id="prior-therapy"
			legend={
				<>
					Prior Therapy <span className="prior-therapy__beta">BETA</span>
				</>
			}
			helpUrl={helpUrl + '#priortherapy'}>
			<p>Search for treatments you have already received. Trials that exclude these therapies will be filtered out.</p>

			<Autocomplete
				id="pt"
				label="Prior Therapy"
				inputHelpText="More than one selection may be made."
				value={priorTherapyVal.value}
				inputProps={{
					placeholder: 'Start typing to select prior therapies',
				}}
				items={filterSelectedItems(priorTherapyOptionsData, priorTherapy)}
				getItemValue={(item) => item.name}
				shouldItemRender={() => true}
				onChange={(event, value) => setPriorTherapyVal({ value })}
				onSelect={(value) => {
					handleUpdate('priorTherapy', [...priorTherapy, priorTherapyOptionsData.find(({ name }) => name === value)]);
					setPriorTherapyVal({ value: '' });
				}}
				multiselect={true}
				chipList={priorTherapy}
				onChipRemove={(e) => {
					const newChips = priorTherapy.filter((item) => item.name !== e.label);
					handleUpdate('priorTherapy', [...newChips]);
				}}
				renderMenu={(children) => <div className="cts-autocomplete__menu --drugs">{priorTherapyVal.value.length > 2 ? filterSelectedItems(priorTherapyOptionsData, priorTherapy).length ? children : <div className="cts-autocomplete__menu-item">No results found</div> : <div className="cts-autocomplete__menu-item">{placeholderText}</div>}</div>}
				renderItem={(item, isHighlighted) => applyOptionsFilterAndFormatting(priorTherapyVal, item, isHighlighted)}
			/>
		</Fieldset>
	);
};

PriorTherapy.propTypes = {
	handleUpdate: PropTypes.func,
};

export default PriorTherapy;
